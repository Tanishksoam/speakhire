import express, { Request, Response } from "express";
import Form from "../models/formsSchema";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Types } from "mongoose";

const router = express.Router();

// Create a new form - no authentication required
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, description, formFields } = req.body;

    if (
      !title ||
      !formFields ||
      !Array.isArray(formFields) ||
      formFields.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Form title and fields are required" });
    }

    // Create the form with default values
    const form = await Form.create({
      title,
      description: description || "",
      formFields,
      isTemplate: false,
      publishedUrl: "",
      responses: [],
      recipients: [],
    });

    res.status(201).json({
      message: "Form created successfully",
      data: form,
    });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get form by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Public access - return form without responses
    const publicForm = {
      _id: form._id,
      title: form.title,
      description: form.description,
      formFields: form.formFields,
      isTemplate: form.isTemplate,
      publishedUrl: form.publishedUrl,
    };

    res.json({
      message: "Form retrieved successfully",
      data: publicForm,
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Note: The template and user-specific endpoints have been removed as they're not needed in the no-authentication flow

// Publish a form and send to multiple emails
router.post("/:id/publish", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one email is required" });
    }

    // Check if form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Generate main access token for the form owner
    const accessToken = crypto.randomBytes(32).toString("hex");

    // Generate tokens for each new recipient
    const existingRecipients = form.recipients || [];
    const existingEmails = new Set(existingRecipients.map((r) => r.email));

    const newRecipients = emails
      .filter((email: string) => !existingEmails.has(email))
      .map((email: string) => ({
        email,
        token: crypto.randomBytes(16).toString("hex"),
        used: false,
      }));

    const recipients = [...existingRecipients, ...newRecipients];

    // Update the form with tokens and mark as published
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      {
        accesstoke: accessToken,
        recipients,
        isTemplate: true,
        publishedUrl: `${
          process.env.CLIENT_URL || "https://speakhire.vercel.app"
        }/forms/${id}`,
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Failed to update form" });
    }

    // Create the form URL with token for each recipient
    const baseUrl = process.env.CLIENT_URL || "https://speakhire.vercel.app";
    const formLinks = recipients.map((recipient) => {
      return {
        email: recipient.email,
        link: `${baseUrl}/forms/${id}/respond?email=${encodeURIComponent(
          recipient.email
        )}&token=${recipient.token}`,
        token: recipient.token,
      };
    });

    // Create the admin link for the form owner
    const adminLink = `${baseUrl}/forms/${id}/admin?token=${accessToken}`;

    // Send emails if email configuration is available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        for (const recipient of formLinks) {
          await transporter.sendMail({
            from: `"SpeakHire" <${process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: `You've been invited to fill out a form: ${form.title}`,
            html: `
              <h1>You've been invited to fill out a form</h1>
              <p>Form: ${form.title}</p>
              <p>Click the link below to access the form:</p>
              <a href="${recipient.link}">Access Form</a>
              <p>Or use the following information:</p>
              <p>Form ID: ${id}</p>
              <p>Your Token: ${recipient.token}</p>
              <p>Your Email: ${recipient.email}</p>
            `,
          });
        }
        console.log(
          `Successfully sent form invitations to ${recipients.length} recipients`
        );
      } catch (error) {
        console.error("Error sending emails:", error);
        // Continue execution even if email sending fails
      }
    } else {
      console.warn("Email configuration not found. Skipping email sending.");
      console.log(
        "Generated tokens:",
        formLinks.map((link) => ({
          email: link.email,
          token: link.token,
          link: link.link,
        }))
      );
    }

    // Return success response with form details
    res.status(200).json({
      message: "Form published successfully",
      data: {
        formId: id,
        formTitle: form.title,
        accessToken: accessToken,
        adminLink: adminLink,
        recipients: formLinks.map((link) => ({
          email: link.email,
          token: link.token,
          link: link.link,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("Error publishing form:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: "Failed to publish form",
      error: errorMessage,
    });
  }
});

// Note: The /:id/invite endpoint has been replaced by the more comprehensive /:id/publish endpoint

// Submit a form response
// router.post("/:id/submit", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { response, email, token } = req.body;
//     console.log(response);

//     if (!response || !email || !token) {
//       return res
//         .status(400)
//         .json({ message: "Response data, email, and token are required" });
//     }

//     // Check if form exists
//     const form = await Form.findById(id);
//     if (!form) {
//       return res.status(404).json({ message: "Form not found" });
//     }

//     // Find the recipient with matching email and token
//     const recipient = form.recipients.find(
//       (r) => r.email === email && r.token === token && !r.used
//     );

//     if (!recipient) {
//       return res.status(403).json({ message: "Invalid or used token" });
//     }

//     // Mark the token as used
//     await Form.updateOne(
//       {
//         _id: id,
//         "recipients.email": email,
//         "recipients.token": token,
//       },
//       { $set: { "recipients.$.used": true } }
//     );

//     // Check if user has already submitted a response
//     const existingResponse = form.responses || [];
//     const hasExistingResponse = existingResponse.some((r) => r.email === email);
//     if (hasExistingResponse) {
//       return res
//         .status(400)
//         .json({ message: "You have already submitted a response" });
//     }

//     // Create response object with email and responses
//     const responseObj = {
//       email,
//       responses: response,
//       submittedAt: new Date()
//     };

//     await Form.findByIdAndUpdate(
//       id,
//       { $push: { responses: responseObj } },
//       { new: true }
//     );

//     // Send thank you email if email configuration is available
//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       try {
//         const transporter = nodemailer.createTransport({
//           service: process.env.EMAIL_SERVICE || "gmail",
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//           },
//         });

//         await transporter.sendMail({
//           from: `"SpeakHire" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: `Thank You for Your Response - ${form.title}`,
//           html: `
//             <h1>Thank You for Your Response!</h1>
//             <p>We've successfully received your response for the form: <strong>${
//               form.title
//             }</strong></p>
//             ${form.description ? `<p>${form.description}</p>` : ""}
//             <p>If you have any questions, please don't hesitate to contact us.</p>
//             <p>Best regards,<br/>The SpeakHire Team</p>
//           `,
//         });
//         console.log(`Thank you email sent to ${email}`);
//       } catch (emailError) {
//         console.error("Error sending thank you email:", emailError);
//         // Don't fail the request if email sending fails
//       }
//     }

//     res.status(200).json({
//       message: "Response submitted successfully",
//       data: {
//         formId: id,
//         email: email,
//       },
//     });
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/:id/submit", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, token, response } = req.body;

  try {
    console.log("Form ID:", id);
    console.log("Request body:", req.body);
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    const recipient = form.recipients.find(
      (r) => r.email === email && r.token === token
    );
    if (!recipient || recipient.used)
      return res.status(401).json({ error: "Invalid or already used token" });

    // Save the form response
    form.responses.push({
      email,
      responses: response, // must match schema key
    });

    // Mark token as used
    recipient.used = true;

    await form.save();
    // Optional: Send thank-you email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"SpeakHire" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank You for Your Response - ${form.title}`,
        html: `
          <h1>Thank You for Your Response!</h1>
          <p>We've successfully received your response for the form: <strong>${
            form.title
          }</strong></p>
          ${form.description ? `<p>${form.description}</p>` : ""}
          <p>Best regards,<br/>The SpeakHire Team</p>
        `,
      });
    }

    res.status(200).json({
      message: "Response submitted successfully",
      data: { formId: id, email },
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify token for form access
router.post("/:id/verify-token", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, token } = req.body;
    const { adminToken } = req.query; // For admin access verification

    // Check if form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({
        valid: false,
        message: "Form not found",
      });
    }

    // Check if this is an admin token verification
    if (adminToken) {
      const isAdminValid = form.accesstoke === adminToken;
      return res.status(isAdminValid ? 200 : 403).json({
        valid: isAdminValid,
        message: isAdminValid ? "Admin access verified" : "Invalid admin token",
        form: isAdminValid ? form : undefined,
      });
    }

    // Regular recipient token verification
    if (!email || !token) {
      return res.status(400).json({
        valid: false,
        message: "Email and token are required",
      });
    }

    // Find the recipient with matching email and token
    const recipient = form.recipients.find(
      (r) => r.email === email && r.token === token
    );

    if (!recipient) {
      return res.status(403).json({
        valid: false,
        message: "Invalid token or email",
      });
    }

    // Check if token has been used
    if (recipient.used) {
      return res.status(403).json({
        valid: false,
        message: "This token has already been used",
      });
    }

    // Token is valid and not used
    return res.status(200).json({
      valid: true,
      message: "Token verified successfully",
      data: {
        formId: form._id,
        title: form.title,
        description: form.description,
        formFields: form.formFields,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      valid: false,
      message: "Server error",
    });
  }
});

// Get form responses (admin access)
router.get("/:id/responses", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Access token is required" });
    }

    // Find the form
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Verify the access token
    if (form.accesstoke !== token) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    // Return just the responses
    res.status(200).json({
      message: "Form responses retrieved successfully",
      data: {
        formId: form._id,
        title: form.title,
        responses: form.responses,
        recipientCount: form.recipients.length,
        responseCount: form.responses.length,
      },
    });
  } catch (error) {
    console.error("Error accessing form responses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

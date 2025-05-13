import express, { Request, Response } from "express";
import Form from "../models/Form";
import User from "../models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// Create a new form
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, fields, createdBy, isTemplate = false } = req.body;

    // Create the form
    const form = await Form.create({
      title,
      fields,
      createdBy,
      isTemplate,
    });

    // Update the user's formsCreated array
    await User.findByIdAndUpdate(createdBy, {
      $push: { formsCreated: form._id },
    });

    res.status(201).json(form);
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

    res.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all template forms - public access, no authentication needed
router.get("/templates/public", async (req: Request, res: Response) => {
  try {
    const templates = await Form.find({ isTemplate: true });
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a template form
router.post("/templates/create", async (req: Request, res: Response) => {
  try {
    const { title, fields, createdBy } = req.body;

    // Create the template form
    const form = await Form.create({
      title,
      fields,
      createdBy,
      isTemplate: true, // Mark as template
    });

    // Update the user's formsCreated array
    await User.findByIdAndUpdate(createdBy, {
      $push: { formsCreated: form._id },
    });

    res.status(201).json(form);
  } catch (error) {
    console.error("Error creating template form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get forms created by a user
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const forms = await Form.find({ createdBy: userId });
    res.json(forms);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send invites to fill a form
router.post("/:id/invite", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emails, userId } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "At least one email is required" });
    }

    // Check if form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Generate tokens for each email and update user's accessMap
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if this form is already in the user's accessMap
    const existingMapIndex = user.accessMap.findIndex(
      (map) => map.formId.toString() === id
    );

    const inviteUsers = emails.map((email: string) => ({
      email,
      token: crypto.randomBytes(16).toString("hex"),
      used: false,
    }));

    let updatedUser;
    if (existingMapIndex !== -1) {
      // Add to existing accessMap entry
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            [`accessMap.${existingMapIndex}.allowedUsers`]: {
              $each: inviteUsers,
            },
          },
        },
        { new: true }
      );
    } else {
      // Create new accessMap entry
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            accessMap: {
              formId: id,
              allowedUsers: inviteUsers,
            },
          },
        },
        { new: true }
      );
    }


    // Try to send emails if email configuration is available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        for (const inviteUser of inviteUsers) {
          const link = `${process.env.CLIENT_URL || 'http://localhost:3000'}/form/${id}?token=${inviteUser.token}`;
          
          await transporter.sendMail({
            from: `"SpeakHire" <${process.env.EMAIL_USER}>`,
            to: inviteUser.email,
            subject: `You are invited to fill the form: ${form.title}`,
            html: `
              <h2>You've been invited to fill a form</h2>
              <p>Form title: ${form.title}</p>
              <p>Click here to participate: <a href="${link}">${link}</a></p>
              <p>Your access token: ${inviteUser.token}</p>
            `,
          });
        }
        console.log(`Successfully sent invites to ${inviteUsers.length} users`);
      } catch (error) {
        console.error("Error sending emails:", error);
        // Continue execution even if email sending fails
      }
    } else {
      console.warn('Email configuration not found. Skipping email sending.');
      console.log('Generated tokens:', inviteUsers.map(u => ({
        email: u.email,
        token: u.token,
        link: `${process.env.CLIENT_URL || 'http://localhost:3000'}/form/${id}?token=${u.token}`
      })));
    }

    // Return success response with the updated user data
    res.status(200).json({
      message: "Invites processed successfully",
      data: {
        formId: id,
        invitedUsers: inviteUsers.map(u => ({
          email: u.email,
          token: u.token,
          used: u.used
        }))
      }
    });
  } catch (error: unknown) {
    console.error("Error in invite endpoint:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      message: "Failed to process invites",
      error: errorMessage
    });
  }
});

// Submit a form response
router.post("/:id/submit", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { response, email, token } = req.body;

    // Check if form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Find the user who created the form and check if the submitter is authorized
    const formCreator = await User.findOne({
      "accessMap.formId": id,
    });

    if (!formCreator) {
      return res.status(404).json({ message: "Form creator not found" });
    }

    // Find the access map entry for this form
    const accessMapEntry = formCreator.accessMap.find(
      (entry) => entry.formId.toString() === id
    );

    if (!accessMapEntry) {
      return res.status(403).json({ message: "Access map entry not found" });
    }

    // Find the user in the allowed users list with matching email and token
    const allowedUser = accessMapEntry.allowedUsers.find(
      (user) => user.email === email && user.token === token && !user.used
    );

    if (!allowedUser) {
      return res.status(403).json({ message: "Invalid or used token" });
    }

    // Mark the token as used
    await User.updateOne(
      {
        _id: formCreator._id,
        "accessMap.formId": id,
        "accessMap.allowedUsers.email": email,
        "accessMap.allowedUsers.token": token,
      },
      { $set: { "accessMap.$[map].allowedUsers.$[user].used": true } },
      {
        arrayFilters: [
          { "map.formId": id },
          { "user.email": email, "user.token": token },
        ],
      }
    );

    // Add response to form
    await Form.findByIdAndUpdate(id, { $push: { responses: response } });

    res.json({ message: "Response submitted successfully" });
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

    // Check if form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({
        valid: false,
        message: "Form not found",
      });
    }

    // Check if the form is a template (public access)
    if (form.isTemplate) {
      return res.status(200).json({
        valid: true,
        message: "This is a public template form",
        form: form,
      });
    }

    // Find the user who created the form
    const formCreator = await User.findOne({
      "accessMap.formId": id,
    });

    if (!formCreator) {
      return res.status(404).json({
        valid: false,
        message: "Form creator not found",
      });
    }

    // Find the access map entry for this form
    const accessMapEntry = formCreator.accessMap.find(
      (entry) => entry.formId.toString() === id
    );

    if (!accessMapEntry) {
      return res.status(403).json({
        valid: false,
        message: "Access map entry not found",
      });
    }

    // Find the user in the allowed users list with matching email and token
    const allowedUser = accessMapEntry.allowedUsers.find(
      (user) => user.email === email && user.token === token
    );

    if (!allowedUser) {
      return res.status(403).json({
        valid: false,
        message: "Invalid token or email",
      });
    }

    // Check if token has been used
    if (allowedUser.used) {
      return res.status(403).json({
        valid: false,
        message: "This token has already been used",
      });
    }

    // Token is valid and not used
    return res.status(200).json({
      valid: true,
      message: "Token verified successfully",
      form: form,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      valid: false,
      message: "Server error",
    });
  }
});

export default router;

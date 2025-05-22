import contactService from "../../../models/contact";

export const contactMutationControllers = {
    createContact: async (req: any, res: any) => {
        try {
            const { name, email, subject, message } = req.body;
            // Logic to create a contact
            const contact = await contactService.sendContact({ name, email, subject, message });
            res.status(201).json({ message: "Contact created successfully", contact });
        } catch (error) {
            console.error("Error creating contact:", error);
            res.status(500).json({ error: "Failed to create contact" });
        }
    }
};
import storeService from '../../../models/store';

export const storeQueryControllers = {
    getStoreCurrency: async (req: any, res: any) => {
        try {
            const storeCurrency = await storeService.fetchStoreCurrency();
            if (!storeCurrency) {
                return res.status(404).json({ Message: "Store currency not found" });
            }
            res.status(200).json({ Message: `Store currency fetched successfully`, Data: storeCurrency });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch store currency" });
        }
    },
};
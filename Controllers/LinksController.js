import LinksModel from "../Models/LinksModel.js";

const LinksController = {
    getList: async (req, res) => {
        try {
            const links = await LinksModel.find(); // Fetch all links
            res.json(links);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    getById: async (req, res) => {
        try {
            const link = await LinksModel.findById(req.params.id);
            if (link) {
                if (!link.clicks) {
                    link.clicks = []; // Ensure clicks is an array
                }

                let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

                if (ipAddress === "::1") {
                    ipAddress = "127.0.0.1";
                }
                // Ensure targetParamValue captures the value from the request query
                const targetParamValue = req.query.targetParamName||req.query.t || '';
console.log('targetParamValue',targetParamValue)
                // Find the target value name
                let targetValueName = '';
                const targetValueObj = link.targetValues.find(value => value.value === targetParamValue);
                if (targetValueObj) {
                    targetValueName = targetValueObj.name;
                    console.log('targetValueName',targetValueName)
                }
                const newClick = {
                    insertedAt: new Date(),
                    ipAddress,
                    targetParamValue,
                    targetValueName // storing the name as well
                };
                console.log(newClick,"new Click")
                link.clicks.push(newClick);

                await link.save();

                res.redirect(link.originalUrl);
            } else {
                res.status(404).json({ message: 'Link not found' });
            }
        } catch (e) {
            res.status(400).json({ message: e.message });
            console.error(e); // Log the error for debugging
        }
    },

    getByClick: async (req, res) => {
        try {
            const link = await LinksModel.findById(req.params.id);
            if (link) {
                const groupedClicks = link.clicks.reduce((acc, click) => {
                    if (!acc[click.targetParamValue]) {
                        acc[click.targetParamValue] = [];
                    }
                    acc[click.targetParamValue].push(click);
                    return acc;
                }, {});

                const result = Object.keys(groupedClicks).map(key => ({
                    targetParamValue: key,
                    clicks: groupedClicks[key]
                }));

                res.json(result);
            } else {
                res.status(404).json({ message: 'Link not found' });
            }
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    add: async (req, res) => {
        const { originalUrl, targetParamName, targetValues } = req.body;
        try {
            const newLink = await LinksModel.create({ originalUrl, targetParamName, targetValues }); // Add new link
            res.json(newLink);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedLink = await LinksModel.findByIdAndUpdate(id, req.body, { new: true }); // Update by ID
            res.json(updatedLink);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await LinksModel.findByIdAndDelete(id); // Delete by ID
            res.json(deleted);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
};

export default LinksController;
const inventoryDb = require("../db/queries/inventoryQueries");

async function getDashboard(req, res) {
    try {
        const stats = await inventoryDb.getDashboardStats();
        const lowStockItems = await inventoryDb.getLowStockItems(5);

        console.log("Dashboard stats: ", stats);
        console.log("Low stock items: ", lowStockItems);

        res.json({
            stats,
            lowStockItems,
        });
    } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
}

module.exports = {
    getDashboard,
};

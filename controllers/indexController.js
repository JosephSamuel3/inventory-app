const inventoryDb = require("../db/queries/inventoryQueries");

async function getDashboard(req, res) {
    try {
        const [stats, recentItems, lowStockItems] = await Promise.all([
            inventoryDb.getDashboardStats(),
            inventoryDb.getRecentItems(3),
            inventoryDb.getLowStockItems(5),
        ]);

        res.render("index", {
            title: "Inventory Manager",
            stats,
            recentItems,
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

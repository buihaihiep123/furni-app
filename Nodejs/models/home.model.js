// dataModel.js
const ketnoi = require('../connect-mysql');
const util = require('util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

exports.getData = async () => {
    try {

        const [billResult, productResult, categoryResult, accountResult, total_amount, totalbymonth, totalspctr, orderStatusCount, topProducts] = await Promise.all([
            query("select count(bill_id) as billCount from bill"),
            query("select count(product_id) as productCount from detail_product"),
            query("select count(category_id) as categoryCount from categories"),
            query("select count(account_id) as accountCount from account"),
            query("select sum(total_amount) as totalBill from bill where status = 0"),
            query(`SELECT DATE_FORMAT(bill_date, '%Y-%m') AS month, 
            SUM(total_amount) AS totalBill FROM bill WHERE status = 0 AND bill_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY month 
            ORDER BY month;
            `),
            query(`SELECT c.category_id, c.category_name, COUNT(p.product_id) AS countprobyctr 
            FROM detail_product p
            INNER JOIN categories c ON p.category_id = c.category_id
            GROUP BY c.category_id, c.category_name;
            `),
            query(`SELECT
                COUNT(CASE WHEN status = 0 THEN 1 END) AS boughtCount,
                COUNT(CASE WHEN status != 0 THEN 1 END) AS notBoughtCount
               FROM bill;
            `),
            query(`SELECT p.product_id, p.product_name, SUM(b.quantity) as totalQuantity, SUM(b.price * b.quantity) as totalPrice
                   FROM bill_detail b
                   JOIN detail_product p ON b.product_id = p.product_id
                   GROUP BY p.product_id, p.product_name
                   ORDER BY totalQuantity DESC
                   LIMIT 3;
            `)

        ]);
        return {
            billCount: billResult[0].billCount,
            productCount: productResult[0].productCount,
            categoryCount: categoryResult[0].categoryCount,
            accountCount: accountResult[0].accountCount,
            total_amount: total_amount[0].totalBill,
            totalbymonth: totalbymonth,
            totalspctr: totalspctr,
            boughtCount: orderStatusCount[0].boughtCount,
            notBoughtCount: orderStatusCount[0].notBoughtCount,
            topProducts: topProducts
        };


    } catch (err) {
        console.error("Error fetching data: ", err);
        throw err;
    }
};


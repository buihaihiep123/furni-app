const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

module.exports = function (app) {
    app.get('/api/favorite/:account_id',(req,res)=>{
        let account_id = req.params.account_id;
        let sql = "SELECT * FROM favorite WHERE account_id = ? ORDER BY favorite_id DESC"
        ketnoi.query(sql,[account_id],(err,data)=>{
            res.json({
                result: data,
                code:200
            })
        })
    })
    app.get('/api/favorite',(req,res)=>{
        let sql = "SELECT * FROM favorite ORDER BY favorite_id DESC"
        ketnoi.query(sql,(err,data)=>{
            res.json({
                result: data,
                code:200
            })
        })
    })

    app.post('/api/favorite/check', async function (req, res) {
    try {

      const account_id = req.body.accountId;
      const product_id = req.body.productId;
      let sql_check = "SELECT * FROM favorite WHERE account_id = ? AND product_id = ?";
      let favorite = await query(sql_check, [account_id, product_id],(err,data)=>{
        if(!err){

            return res.json({
                result: data,
                code: 200
              });
        }
        else{
            console.log("lỗi",err)
        }
      });
      
    } catch (err) {
      console.log('Error:', err);
      res.json({
        result: "",
        code: 405,
        message: "Lỗi"
      });
    }
  });
    app.post('/api/favorite', async function (req, res) {
        try {   
        const account_id=req.body.account_id;
        const product_id=req.body.product_id
            // Kiểm tra xem mục yêu thích đã tồn tại chưa
            let sql_check = "SELECT * FROM favorite WHERE account_id = ? AND product_id = ?";
            let favorite = await query(sql_check, [account_id, product_id]);
            if (favorite.length > 0) {
                // Nếu đã tồn tại, xóa mục yêu thích
                let sql_delete = "DELETE FROM favorite WHERE account_id = ? AND product_id = ?";
                await query(sql_delete, [account_id, product_id]);
                res.json({
                    result: "",
                    code: 200,
                    message: "Bỏ yêu thích thành công"
                });
            } else {
                // Nếu chưa tồn tại, thêm mục yêu thích
                let sql_insert = "INSERT INTO favorite SET ?";
                let data = await query(sql_insert,  req.body);
                req.body.id = data.insertId; // Gán insertId vào req.body
                res.json({
                    result: req.body,
                    code: 200,
                    message: "Đã thêm vào yêu thích"
                });
            }
        } catch (err) {
            res.json({
                result: "",
                code: 405,
                message: "Lỗi"
            });
        }
    });
};

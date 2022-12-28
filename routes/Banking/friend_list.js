var express = require('express');
var router = express.Router();
var axios = require("axios");
var { encryptResponse, decryptRequest, decryptEnc} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');

router.get('/', function(req, res, next) {
    const cookie = decryptEnc(req.get("cookie").split("Token=")[1])

    profile(cookie).then(pending=>{

        axios({
            method: "post",
            url: "http://15.152.81.150:3000/api/beneficiary/view", // URL 수정 해야 됨
            headers: {"authorization": "1 " + cookie}
            // data: enData
            // 데이터 안씀
        }).then((data)=>{
            let result = decryptRequest(data.data).data;
            console.log(result);
            var html_data = "<tr><th>친구계좌</th><th>승인여부";
            
            result.forEach(function(a){
                html_data += "<tr><td>"+a.beneficiary_account_number+"</td><td>"+a.approved+"</td></tr>";
            })

            return res.render("Banking/friend", {html : html_data, pending:pending});
        }).catch(function(error){
            var html_data = "<tr>아싸시군요</tr>";
            return res.render("Banking/friend", {html : html_data, pending:pending});
        });

    })

   
})


router.post('/', function(req, res, next) {
    const cookie = decryptEnc(req.get("cookie").split("Token=")[1])
    let {beneficiary_account_number} = req.body;
    const baseData=`{"account_number": ${beneficiary_account_number}}`
    const enData = encryptResponse(baseData);
    
    axios({
        method: "post",
        url: "http://15.152.81.150:3000/api/Beneficiary/add", // URL 수정 해야 됨
        headers: {"authorization": "1 " + cookie},
        data: enData
        // 데이터 안씀
    }).then((data)=>{
        console.log(decryptRequest(data.data));
    });
    return res.redirect("friend");
})

module.exports = router;
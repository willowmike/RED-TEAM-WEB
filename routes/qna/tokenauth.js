const axios = require("axios");
var {decryptEnc} = require("../../middlewares/crypt");

exports.authresult = function (req, callback) {
    let cookie = "";
    try {
        cookie = req.cookies.Token
    } catch (e) {
        return res.send("<script>alert('로그인을 해주세요'); location.href = \"/user/login\";</script>");
    }
    axios({
        method: "get",
        url: api_url + "/api/auth/check",

        headers: {"authorization": "1 " + cookie},

    }).then((data) => {
        if (data.data.status.message == 'Success') {
            var result = true;
        } else {
            var result = false;
        }
        callback(result);
    });
}


const express = require('express'); 
const router = express.Router();
const socket = require('socket.io-client')('http://jusk2.asuscomm.com:5002');
let trash = 'false';

socket.on('connected', function (data) {
    console.log(data);
});

socket.on('trash', function (data) {
    trash = data;
});

const checkUserKey = (req, res, next) => {
    if (req.body.user_key !== undefined) {
        next();
    } else {
        res.status.send({error: 'user_key is undefined'});
    }
};

router.get('/keyboard', (req, res) => {
    console.log('*****   connect keyboard router   *****');
    const menu = {
        type: 'buttons',
        buttons: ["청소확인"]
    };
    res.set({
        'contents-type': 'application/json'
    }).send(JSON.stringify(menu));
});
router.post('/message', checkUserKey, (req, res) => {
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };
    let msg = '아직 여유 있어요^^';
    if (trash === 'true') {
        msg = 'N4동 쓰레기통을 비워주세요!!';
    }
    let massage = {
        "message": {
            "text": msg
        },
        "keyboard": {
            "type": "buttons",
            "buttons": [
                "청소확인",
            ]
        }
    };

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(massage));
});

router.post('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방에 참가했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});

router.delete('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방을 차단했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});
module.exports = router;

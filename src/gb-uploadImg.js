/**
 * GB-uploadImg
 * @description GB-uploadImg controller and init script
 * @param   {String}    token   Google Appscript webapp token
 * @param   {String}    channel_id  Discord channel id  
 */

class gb_upload {
    constructor(token, channel_id) {
        this.base = this.c_uri(token);
        this.channel_id = channel_id;
    }

    init() {
        const base = this.base,
        channel_id = this.channel_id,
        makeid = this.makeid;
        document
        .querySelectorAll(".gb-uploadimg")
        .forEach(function(e) {
            const server = base + "?m=uploadimg&channel_id=" + channel_id + "&q=" + makeid(8)
            var [input, button] = e.children;
            button.onclick = function() {
            var base_text = button.innerText;
            var win = window.open(server, "_blank");
            var timer = setInterval(async function() {
                button.innerText = "please await..."
                button.disabled = true;
                if (win.closed) {
                clearInterval(timer);
                var exchange = server.replace("uploadimg", "exchangeimg");
                var res = await fetch(exchange);
                res = await res.json();

                if (res.data.length) {
                    input.value = res.data[1];
                    button.innerText = "done"
                } else {
                    button.innerText = base_text;
                    button.removeAttribute("disabled");
                }
                // console.log(button)
                // alert('closed');
                }
            }, 1000);
            }
        })
    }

    c_uri(_t) {
        var b = "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x73\x63\x72\x69\x70\x74\x2e\x67\x6f\x6f\x67\x6c\x65\x2e\x63\x6f\x6d\x2f\x6d\x61\x63\x72\x6f\x73\x2f\x73\x2f";
        return b + _t + atob('L2V4ZWM=');
    }

    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }
}
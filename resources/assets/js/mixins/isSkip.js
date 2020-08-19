export default function (msg) {
    if (msg.type === 'button' 
        &&  msg.data.external 
        && msg.data.buttons.filter(btn => btn.type !== 'skip').length <= 0
        && msg.data.buttons.find(btn => btn.type === 'skip')) {
        return 'skip'
    } else {
        return msg.type
    }
}
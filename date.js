
exports.getDate =   function () {
    const today = new Date();
    const currentDay = today.getDay();
    
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    return today.toLocaleDateString('en-US', options);

    
};

exports.getDay = function() {
    const today = new Date();
    const currentDay = today.getDay();
    const options = {
        weekday: 'long',
    };
    return today.toLocaleDateString('en-US', options);
};
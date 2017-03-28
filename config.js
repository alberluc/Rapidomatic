module.exports = {
	
	max_players: 2,

	random: function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}
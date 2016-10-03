class Map {

	constructor (map){
		this.map = map;
	}

	getMap() 
	{
		var mapX = 28;
		var mapY = 31;
		// var mapX = this.map.width;
		// var mapY = this.map.heigth;
		var map = new Array(mapY);

		for (var y = 0; y < mapY; y++) {
			map[y] = new Array(mapX);
		}

		for (var y = 0; y < 31; y++) {
			for (var x = 0; x < 28; x++) {
				if (this.map[y][x].index == 7 || this.map[y][x].index == 14) 
				{
					map[y][x] = true;
				}
				else 
				{
					map[y][x] = false;
				}
			}
		}
		return map;
	}
}
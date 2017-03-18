class PathFinder
{

	// SearchParameters searchParameters
	constructor (searchParameters)
	{
		this.searchParameters = searchParameters;
		this.nodes = this.InitializeNodes(searchParameters.Map);
		this.startNode = this.nodes[searchParameters.StartLocation.x][searchParameters.StartLocation.y];
		this.startNode.State = new NodeState().Open;
		this.endNode = this.nodes[searchParameters.EndLocation.x][searchParameters.EndLocation.y];
	}

	InitializeNodes(map)
	{
		this.width = map[0].length; // 28
		this.height = map.length; // 31

		var nodes = new Array(this.height);

		for (var i = 0; i < this.height; i++) {
			nodes[i] = new Array(this.width);
		}

		for (var y=0; y < this.height; y++) 
		{ 
			for (var x=0; x < this.width; x++) { 
				nodes[y][x] = new Node(y, x, map[y][x], this.searchParameters.EndLocation);
			}
		}
		return nodes;
	}

	sortNodes(a, b)
	{
		if (a.F == b.F) {
			return 0;
		}
		else if(a.F < b.F)
		{
			return -1;
		}
		return 1;
	}

	FindPath()
	{
		var path = [];
		var success = this.Search(this.startNode);

		if (success) 
		{
			var node = this.endNode;

			while(node.getParentNode() != null)
			{
				// console.log(node);
				path.push(node.Location);
				node = node.getParentNode();
			}
			path.reverse();
		}
		return path;
	}

	// Node currentNode 
	Search(currentNode)
	{
		currentNode.State = new NodeState().Closed;
		var nextNodes = this.GetWalkableNodesAround(currentNode);
		nextNodes.sort(this.sortNodes);

		for (var next in nextNodes) {

			if (nextNodes[next].Location == this.endNode.Location) 
			{
				return true;
			}
			else
			{
				if (this.Search(nextNodes[next])) 
				{
					// console.log(nextNodes[next]);
					return true;
				}
			}
		}
		return false;
	}

	// Node fromNode
	GetWalkableNodesAround(fromNode)
	{
		var walkableNodes = [];
		var nextLocations = this.getLocations(fromNode.Location);

		for (var loc = 0; loc < nextLocations.length; loc++) {

			var x = nextLocations[loc].x;
			var y = nextLocations[loc].y;

			// console.log(this.nodes[x][y]);

			if (x < 0 || x >= (this.width + 2) || y < 0 || y >= (this.height + 2)) 
			{
				continue;
			}

			var node = this.nodes[x][y];

			if (!node.IsWalkable) 
			{
				continue;
			}

			if (node.State == new NodeState().Closed) 
			{
				continue;
			}

			if (node.State == new NodeState().Open) 
			{
				var traversalCost = Node.getTraversalCost(node.Location, node.ParentNode.Location);
				var gTemp = fromNode.G + traversalCost;

				if (gTemp < node.G) 
				{
					// node.ParentNode = fromNode;
					node.setParentNode(fromNode);
					walkableNodes.push(node);
				}
			}
			else
			{
				// node.ParentNode = fromNode;
				node.setParentNode(fromNode);
				node.State = new NodeState().Open;
				walkableNodes.push(node);

			}
		}
		return walkableNodes;
	}

	// Point fromLocationNode
	getLocations(fromLocationNode)
	{
		return new Array
		(
			new Phaser.Point(fromLocationNode.x - 1, fromLocationNode.y),
			new Phaser.Point(fromLocationNode.x + 1, fromLocationNode.y),
			new Phaser.Point(fromLocationNode.x, fromLocationNode.y - 1),
			new Phaser.Point(fromLocationNode.x, fromLocationNode.y + 1)
		);
	}
}
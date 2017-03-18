class Node 
{

	constructor(x, y, isWalkable,endLocation)
	{
		this.IsWalkable = isWalkable;
		this.State = new NodeState().Untested;
		this.ParentNode = null;
		this.Location = new Phaser.Point(x,y);
		this.H = Node.getTraversalCost(this.Location,endLocation);
		this.G = 0;
		this.setF();
	}

	setParentNode(parentNode) 
	{
		this.ParentNode = parentNode;
		this.G = parentNode.G + Node.getTraversalCost(this.Location, parentNode.Location);
		this.setF();
	}

	getParentNode()
	{
		return this.ParentNode;
	}

	setF()
	{
		this.F = this.G + this.H;
	}

	static getTraversalCost(location, otherLocation)
	{
		var deltaX = otherLocation.x - location.x;
		var deltaY = otherLocation.y - location.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}

}
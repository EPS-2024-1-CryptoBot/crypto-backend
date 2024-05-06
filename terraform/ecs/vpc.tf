resource "aws_vpc" "ecs_vpc" {
  cidr_block            = "20.0.0.0/16"
  enable_dns_hostnames  = true
  enable_dns_support    = true
  tags                  = {
    Name    = "ecs_vpc"
    Related = "ecs"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.ecs_vpc.id
  tags = {
    Name    = "gw"
    Related = "ecs"
  }
}

resource "aws_route_table" "rtb" {
  vpc_id = aws_vpc.ecs_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = {
    Name    = "rtb"
    Related = "ecs"
  }
}
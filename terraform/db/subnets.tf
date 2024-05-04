resource "aws_subnet" "subnet_a" {
  vpc_id     = aws_vpc.postgres_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name    = "subnet_a"
    Related = "db"
  }
}

resource "aws_subnet" "subnet_b" {
  vpc_id     = aws_vpc.postgres_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name    = "subnet_b"
    Related = "db"
  }
}

resource "aws_subnet" "subnet_c" {
  vpc_id     = aws_vpc.postgres_vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "us-east-1c"
  tags = {
    Name    = "subnet_c"
    Related = "db"
  }
}

##


resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.subnet_a.id
  route_table_id = aws_route_table.rtb.id
}
resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.subnet_b.id
  route_table_id = aws_route_table.rtb.id
}
resource "aws_route_table_association" "c" {
  subnet_id      = aws_subnet.subnet_c.id
  route_table_id = aws_route_table.rtb.id
}
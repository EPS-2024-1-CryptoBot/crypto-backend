resource "aws_vpc" "postgres_vpc" {
  cidr_block            = "10.0.0.0/16"
  enable_dns_hostnames  = true
  enable_dns_support    = true
  tags                  = {
    Name    = "db_vpc"
    Related = "db"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.postgres_vpc.id
  tags = {
    Name    = "gw"
    Related = "db"
  }
}

resource "aws_route_table" "rtb" {
  vpc_id = aws_vpc.postgres_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = {
    Name    = "rtb"
    Related = "db"
  }
}

resource "aws_security_group" "rds_sg" {
  name_prefix = "rds-"
  vpc_id = aws_vpc.postgres_vpc.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name    = "rds-sg"
    Related = "db"
  }
}


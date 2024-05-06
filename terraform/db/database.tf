resource "aws_db_subnet_group" "db_group" {
  name       = "postgres-subgroup"
  subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id, aws_subnet.subnet_c.id]
  tags = {
        Name = "db_subnet_group"
        Related = "db"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage         = 5
  max_allocated_storage     = 20
  identifier                = "crypto-backend-db"
  db_name                   = "users"
  engine                    = "postgres"
  engine_version            = "14.11"
  instance_class            = "db.t3.micro"
  username                  = var.PG_USERNAME
  password                  = var.PG_PASSWORD
  skip_final_snapshot       = true
  publicly_accessible       = true
  port                      = 5432
  vpc_security_group_ids    = [aws_security_group.rds_sg.id]
  db_subnet_group_name      = aws_db_subnet_group.db_group.name
}
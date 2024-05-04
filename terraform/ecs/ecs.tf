resource "aws_ecs_cluster" "cryptobot_backend_cluster" {
  name = var.cryptobot_backend_cluster_name
}

resource "aws_ecs_task_definition" "cryptobot_backend_task" {
  family                   = var.cryptobot_backend_task_famliy
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.cryptobot_backend_task_name}",
      "image": "${var.REGISTRY}/${var.REPOSITORY}:${var.IMAGE_TAG}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${var.container_port},
          "hostPort": ${var.container_port}
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_security_group" "load_balancer_security_group" {
  name_prefix = "lb-"
  vpc_id = aws_vpc.ecs_vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
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
    Name    = "lb-sg"
    Related = "ecs"
  }
}

resource "aws_ecs_service" "cryptobot_backend_service" {
  name            = var.cryptobot_backend_service_name
  cluster         = aws_ecs_cluster.cryptobot_backend_cluster.id
  task_definition = aws_ecs_task_definition.cryptobot_backend_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = aws_ecs_task_definition.cryptobot_backend_task.family
    container_port   = var.container_port
  }

  network_configuration {
    subnets          = ["${aws_subnet.subnet_a.id}", "${aws_subnet.subnet_b.id}", "${aws_subnet.subnet_c.id}"]
    assign_public_ip = true
    security_groups  = ["${aws_security_group.service_security_group.id}"]
  }
}

resource "aws_security_group" "service_security_group" {
  name_prefix = "ecs-"
  vpc_id = aws_vpc.ecs_vpc.id
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name    = "ecs-sg"
    Related = "ecs"
  }
}
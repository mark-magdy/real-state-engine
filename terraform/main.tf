provider "aws" {
  region = "us-east-1"
}

resource "aws_key_pair" "my_key" {
  key_name   = "devops-key"
  public_key = file("C:/Users/hp/.ssh/id_rsa.pub")
}

resource "aws_instance" "ec2" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"

  key_name = aws_key_pair.my_key.key_name

  tags = {
    Name = "devops-ec2"
  }
}
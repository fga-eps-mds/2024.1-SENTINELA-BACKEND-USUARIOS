# 2024.1-SENTINELA-BACKEND-USUARIOS

## Variáveis de ambiente

Copie e cole o conteúdo em "env" para um ".env" antes de rodar o container.

## Comandos de Docker

Para subir o ambiente via Docker e docker-compose utilize os comandos:

```
$ sudo docker-compose up --build
```

Para remover todos os containers, redes, e volumes associados ao projeto Docker Compose. Assim, podemos criar um novo banco que sofreu alterações com:

```
$ docker-compose down --volumes
```

Para remover containers que não estão mais em execução criados pelos docker-compose:

```
$ docker-compose rm -f

```

## Testes

Para execeutar os testes, basta executar:

```
$ docker-compose --profile testing up test
```

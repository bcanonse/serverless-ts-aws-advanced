FROM public.ecr.aws/lambda/nodejs:20-arm64

WORKDIR /opt

RUN npm init -y \
    && npm install sharp \
    && rm -rf node_modules/sharp/vendor/*

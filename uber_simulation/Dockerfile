FROM python:3.9.1
ENV PYTHONUNBUFFERED 1
RUN mkdir /code

RUN apt-get clean && \
    apt-get update && \
    apt-get install -y locales cron


RUN locale-gen en_IN
ENV LANG en_IN
ENV LANGUAGE en_IN:en
ENV LC_ALL en_IN

WORKDIR /code
ADD requirements.txt /code/
# ADD docker-entrypoint.sh /code/
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install -r requirements.txt

ADD . /code/

# RUN chmod +x /code/docker-entrypoint.sh

## Copy source code
COPY . .

EXPOSE 8000

# CMD ["sh", "-c", "python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]



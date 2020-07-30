FROM python:3-onbuild

ADD . /code

WORKDIR /code

RUN pip --no-cache-dir install -r requirements.txt

EXPOSE 5000

CMD [ "python", "extract_named_entity.py"]
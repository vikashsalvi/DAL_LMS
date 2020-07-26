FROM python:3-onbuild

ADD . /code

WORKDIR /code

RUN pip --no-cache-dir install -r requirements.txt

EXPOSE 5001

CMD [ "python", "upload_file_to_analyse.py"]
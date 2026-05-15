from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
DATABASE_URL = "mysql+pymysql://root:JTonbhPRBGLhjUhJIQtGKuzEMrwGrjRW@yamanote.proxy.rlwy.net:11422/railway"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
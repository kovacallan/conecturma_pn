from walrus import *

db = Database(host='localhost', port=6379, db=0)


class DbTurma(Model):
    __database__ = db
    id = AutoIncrementField(primary_key=True)
    turma_nome = TextField(index=True)

    def create_turma(self, turma):
        """
        criar turma a partir do nome
        :param turma:
        :return nome da turma :
        """
        return self.create(turma_nome=turma)

    def read_turma(self):
        """

        :return ordem das keys pelo id:
        """
        return self.query(order_by=self.id)

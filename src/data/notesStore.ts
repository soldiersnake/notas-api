import { randomUUID } from 'crypto';
import { Nota, NotaModel, NotaDocument } from '../models/nota';

function toNota(doc: NotaDocument): Nota {
  return {
    id: doc._id,
    titulo: doc.titulo,
    contenido: doc.contenido,
    fecha: doc.fecha,
  };
}

export async function getAllNotes(): Promise<Nota[]> {
  const docs = await NotaModel.find().exec();
  return docs.map(toNota);
}

export async function getNoteById(id: string): Promise<Nota | null> {
  const doc = await NotaModel.findById(id).exec();
  if (!doc) {
    return null;
  }
  return toNota(doc);
}

export async function createNote(data: { titulo: string; contenido: string }): Promise<Nota> {
  const doc = await NotaModel.create({
    _id: randomUUID(),
    titulo: data.titulo,
    contenido: data.contenido,
    fecha: new Date().toISOString(),
  });
  return toNota(doc);
}

export async function updateNote(
  id: string,
  data: { titulo: string; contenido: string }
): Promise<Nota | null> {
  const doc = await NotaModel.findById(id).exec();
  if (!doc) {
    return null;
  }
  doc.titulo = data.titulo;
  doc.contenido = data.contenido;
  doc.fecha = new Date().toISOString();
  await doc.save();
  return toNota(doc);
}

export async function deleteNote(id: string): Promise<Nota | null> {
  const doc = await NotaModel.findByIdAndDelete(id).exec();
  if (!doc) {
    return null;
  }
  return toNota(doc);
}

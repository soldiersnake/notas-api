import { Schema, model, Document } from 'mongoose';
import { randomUUID } from 'crypto';

export interface Nota {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

export interface NotaDocument extends Document<string> {
  _id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

export const notaSchema = new Schema<NotaDocument>(
  {
    _id: { type: String, default: () => randomUUID() },
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    fecha: { type: String, required: true },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const NotaModel = model<NotaDocument>('Nota', notaSchema);

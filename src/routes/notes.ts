import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Nota } from '../models/nota';
import { notes } from '../data/notesStore';

const router = Router();

// GET /notes - Obtener todas las notas
router.get('/', (_req: Request, res: Response) => {
  res.json(notes);
});

// GET /notes/:id - Obtener una nota por id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ error: `Nota con id '${id}' no encontrada.` });
  }

  return res.json(note);
});

// POST /notes - Crear una nueva nota
router.post('/', (req: Request, res: Response) => {
  const { titulo, contenido } = req.body;

  if (
    !titulo ||
    typeof titulo !== 'string' ||
    titulo.trim() === '' ||
    !contenido ||
    typeof contenido !== 'string' ||
    contenido.trim() === ''
  ) {
    return res.status(400).json({
      error: "Campos inválidos. 'titulo' y 'contenido' son requeridos y deben ser cadenas no vacías.",
    });
  }

  const newNote: Nota = {
    id: randomUUID(),
    titulo: titulo.trim(),
    contenido: contenido.trim(),
    fecha: new Date().toISOString(),
  };

  notes.push(newNote);
  return res.status(201).json(newNote);
});

// PUT /notes/:id - Actualizar una nota existente
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: `Nota con id '${id}' no encontrada.` });
  }

  const { titulo, contenido } = req.body;

  if (
    !titulo ||
    typeof titulo !== 'string' ||
    titulo.trim() === '' ||
    !contenido ||
    typeof contenido !== 'string' ||
    contenido.trim() === ''
  ) {
    return res.status(400).json({
      error: "Campos inválidos. 'titulo' y 'contenido' son requeridos y deben ser cadenas no vacías.",
    });
  }

  const updatedNote: Nota = {
    ...notes[noteIndex],
    titulo: titulo.trim(),
    contenido: contenido.trim(),
    fecha: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  return res.json(updatedNote);
});

// DELETE /notes/:id - Eliminar una nota por id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: `Nota con id '${id}' no encontrada.` });
  }

  const [deletedNote] = notes.splice(noteIndex, 1);
  return res.json({
    message: 'Nota eliminada correctamente.',
    nota: deletedNote,
  });
});

export default router;

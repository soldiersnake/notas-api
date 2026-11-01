import { Router, Request, Response } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../data/notesStore';

const router = Router();

// GET /notes - Obtener todas las notas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las notas.' });
  }
});

// GET /notes/:id - Obtener una nota por id
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const note = await getNoteById(id);
    if (!note) {
      return res.status(404).json({ error: `Nota con id '${id}' no encontrada.` });
    }
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar la nota.' });
  }
});

// POST /notes - Crear una nueva nota
router.post('/', async (req: Request, res: Response) => {
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

  try {
    const newNote = await createNote({
      titulo: titulo.trim(),
      contenido: contenido.trim(),
    });
    return res.status(201).json(newNote);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear la nota.' });
  }
});

// PUT /notes/:id - Actualizar una nota existente (404 antes de 400)
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await getNoteById(id);
    if (!existing) {
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

    const updatedNote = await updateNote(id, {
      titulo: titulo.trim(),
      contenido: contenido.trim(),
    });
    return res.json(updatedNote);
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar la nota.' });
  }
});

// DELETE /notes/:id - Eliminar una nota por id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const deletedNote = await deleteNote(id);
    if (!deletedNote) {
      return res.status(404).json({ error: `Nota con id '${id}' no encontrada.` });
    }

    return res.json({
      message: 'Nota eliminada correctamente.',
      nota: deletedNote,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la nota.' });
  }
});

export default router;

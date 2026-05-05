import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";

const router = Router();

router.post("/", pedidoController.criar);
router.get("/", pedidoController.selecionar);
router.put("/:id", pedidoController.editar);
router.delete("/:id", pedidoController.deletar);

router.post("/:pedidoId/item", pedidoController.adicionarItem);
router.put("/item/:itemId", pedidoController.editarItem);
router.delete("/item/:itemId", pedidoController.removerItem);

export default router;
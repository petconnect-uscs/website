import * as adminService from "../services/admin-service.js";

export const getProfile = async (req, res, next) => {
  try {
    const data = await adminService.getAdminProfile(req.user.admin_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await adminService.updateAdminProfile(
      req.user.admin_id,
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const data = await adminService.listClientsForAdmin();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { cpf } = req.params;
    await adminService.deleteClientByCpf(cpf);
    res.json({ message: "Cliente removido com sucesso" });
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const data = await adminService.listAppointmentsForAdmin();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getRecipes = async (req, res, next) => {
  try {
    const data = await adminService.listRecipesForAdmin();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
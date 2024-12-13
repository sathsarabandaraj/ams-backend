import { type Request, type Response } from 'express'
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffByUUID,
  updateStaff
} from '../services/staff.service'

export const createStaffHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req.body

    const feedback = await createStaff(user)

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message'),
      data: feedback.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: req.t(error.message),
        message: req.t('server.internalServerErr')
      })
    }

    throw error
  }
}

export const getAllStaffHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string)
    const pageSize = parseInt(req.query.pageSize as string)
    const order = req.query.order as string

    const feedback = await getAllStaff(pageNumber, pageSize, order)

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message || 'default.message'),
      data: {
        pageNumber: feedback.pageNumber,
        pageSize: feedback.pageSize,
        totalItemCount: feedback.totalItemCount,
        items: feedback.items
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

export const getStaffByUUIDHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userUUID = req.params.uuid
    const feedback = await getStaffByUUID(userUUID)

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message'),
      data: feedback.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

export const updateStaffController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req.body
    const userUUID = req.params.uuid

    const feedback = await updateStaff(userUUID, user ?? {})

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message'),
      data: feedback.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

// delete user controller
export const deleteStaffController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userUUID = req.params.uuid
    const feedback = await deleteStaff(userUUID)

    return res.status(feedback.statusCode).json({
      message: req.t(feedback.message ?? 'default.message'),
      data: feedback.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: req.t(error.name),
        message: req.t(error.message)
      })
    }

    throw error
  }
}

// src/controllers/DeviceDataController.ts

import { Request, Response } from 'express';
import deviceDataRepository from '../repositories/device.repository';
import xlsx from 'xlsx';
import fs from 'fs';
export interface IDevice extends Document {
  device: string;
  t: Date;
  w: number;
  h: number;
  p1: number;
  p25: number;
  p10: number;
}

class DeviceDataController {
  async getByDeviceId(req: Request, res: Response) {
    const deviceId = req.params.deviceId;
    try {
      const data = await deviceDataRepository.findByDeviceId(deviceId);
      if (!data) {
        return res.status(404).json({ message: 'Device data not found' });
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllPmValues(req: Request, res: Response) {
    try {
      const pmValues = await deviceDataRepository.findAllPmValues();
      return res.status(200).json(pmValues);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async uploadExcelData(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Load Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData:any[] = xlsx.utils.sheet_to_json(sheet);
    const expectedColumns = ['device', 't', 'w', 'h', 'p1', 'p25', 'p10'];

    const actualColumns = Object.keys(excelData[0]);

    const isValidColumns = expectedColumns.every(column => actualColumns.includes(column));

    if (!isValidColumns) return res.status(400).json({ message: 'Invalid column names in the uploaded file' });

    // Validate and process data rows
    const rows = xlsx.utils.sheet_to_json(sheet);
    const validatedRows = await rowValidation(rows);

    // Save validated data to the database
    await deviceDataRepository.bulkInsert(validatedRows);

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({ message: 'Data uploaded successfully' });
  }
  async getDataByTimeRange(req: Request, res: Response) {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Both startTime and endTime are required' });
    }

    try {
      const data = await deviceDataRepository.findByTimeRange(new Date(startTime as string), new Date(endTime as string));
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

async function rowValidation(rows: any) {
  const validatedRows: any[] = [];

  for (const row of rows as IDevice[]) {
    const validatedRow: Partial<IDevice> = {};
    let isvalidation: boolean = true;
    console.log(row);

    // Validate and convert each column's data type
  if (
    typeof row.device !== 'string' ||
    typeof row.t !== 'string' ||
    isNaN(Date.parse(row.t)) ||
    typeof row.w !== 'number' ||
    typeof row.h !== 'string' ||
    typeof row.p1 !== 'number' ||
    typeof row.p25 !== 'number' ||
    typeof row.p10 !== 'number'
  ) {
    isvalidation= false;
  }
    if (isvalidation) {
      
      validatedRows.push(row);

    }
    isvalidation = true
  }
  console.log(validatedRows.length,validatedRows[0]);
  return validatedRows;
}
export default new DeviceDataController();

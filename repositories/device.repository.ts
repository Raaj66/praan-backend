import Device  from '../models/device.model';

class DeviceRepository {
  async findByDeviceId(deviceId: string): Promise<any | null> {
    return Device.findOne({ device: deviceId }).exec();
  }

  async findAllPmValues(): Promise<number[]> {
    const data = await Device.find().select('p1 p25 p10').exec();
    return data.map((item) => [item.p1, item.p25, item.p10]).flat();
  }
  async bulkInsert(data: any[]): Promise<void> {
    await Device.insertMany(data);
  }
  async findByTimeRange(startTime: Date, endTime: Date): Promise<any[]> {
    return await Device.find({
      t: {
        $gte: startTime,
        $lte: endTime,
      },
    });
  }
}

export default new DeviceRepository();

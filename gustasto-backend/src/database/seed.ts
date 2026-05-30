import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env faylını oxuyuruq
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gustasto';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

const TableSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: String, required: true },
  qrCodeUrl: { type: String, default: '' },
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Table = mongoose.model('Table', TableSchema);
const Admin = mongoose.model('Admin', AdminSchema);

async function run() {
  console.log('🔄 MongoDB-yə qoşulur: ', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı uğurludur');

    // 1. Restoran seed edirik
    let restaurant = await Restaurant.findOne({ name: 'Gusto Baku' });
    if (!restaurant) {
      restaurant = new Restaurant({
        name: 'Gusto Baku',
        logo: 'https://lh3.googleusercontent.com/aida/ADBb0ugHZELWWzv84yZGC4tvvUpEAGiMy-hWwrEPimn76u12Bz8k4j5IvYSzkO_epoaF9FZwJFpK5K6zGodHshqZwZO82yBkH-NZGraLV0rfMizR7J-G1UkeeX-l3Qk0egZD3nJPmTxkNqnZdiRcAHmYfVYa9zJpM6qQbOdLYRPoTRTUS0hJt9g8-Et9S2JtD7777-_VMKU2nQLtdJxwLXibxta60PIdkzp7bVNfdKc4l2asTYMSn1O7iEwwfQPR',
        address: 'Nizami küçəsi 42, Bakı, Azərbaycan',
        description: 'Premium dad və xidmətin ünvanı',
      });
      await restaurant.save();
      console.log('🎉 Default restoran ("Gusto Baku") yaradıldı!');
    } else {
      console.log('ℹ️ Restoran ("Gusto Baku") artıq mövcuddur.');
    }

    const restId = restaurant._id.toString();

    // 2. Masaları seed edirik (Masa 1 - Masa 5)
    const existingTablesCount = await Table.countDocuments({ restaurantId: restaurant._id });
    if (existingTablesCount === 0) {
      const tableNumbers = ['04', '08', '12', '15', '18'];
      for (const num of tableNumbers) {
        const table = new Table({
          restaurantId: restaurant._id,
          tableNumber: num,
        });
        const savedTable = await table.save();
        // QR kod url təyin edirik
        savedTable.qrCodeUrl = `http://localhost:5173/?restaurantId=${restId}&tableId=${savedTable._id}`;
        await savedTable.save();
      }
      console.log('🎉 Default 5 masa (04, 08, 12, 15, 18) QR kodları ilə birlikdə yaradıldı!');
    } else {
      console.log(`ℹ️ Masalar artıq mövcuddur (Say: ${existingTablesCount}).`);
    }

    // 3. Admin seed edirik
    const adminEmail = 'admin@gusto.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`ℹ️ Admin (${adminEmail}) artıq mövcuddur.`);
      // Restoran ID-ni update edirik
      existingAdmin.restaurantId = restaurant._id;
      existingAdmin.role = 'super_admin';
      await existingAdmin.save();
      console.log(`✅ Admin (${adminEmail}) restoran ID-si update olundu.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const newAdmin = new Admin({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'super_admin',
        restaurantId: restaurant._id,
      });

      await newAdmin.save();
      console.log('🎉 Default admin hesabı uğurla yaradıldı!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('🔑 Şifrə: admin123');
    }
  } catch (error) {
    console.error('❌ Xəta baş verdi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı bağlandı');
    process.exit(0);
  }
}

run();

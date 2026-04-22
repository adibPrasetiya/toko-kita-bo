import { prismaClient } from "../src/core/lib/database.lib.js";
import { hash } from "../src/core/lib/password.lib.js";

async function main() {
    console.log("🌱 Memulai seeding database...\n");
    console.log("🗑️  Menghapus semua data lama...");

    await prismaClient.session.deleteMany();
    await prismaClient.users.deleteMany();

    console.log("✅ Semua data berhasil dihapus kecuali data serial number\n");

    console.log("Memulai proses seeding database\n");

    console.log("Seeding akun admin ...\n");

    const hashPassword = await hash("Password123!@");

    const adminUser = await prismaClient.users.create({
        data: {
            username: "muhadib1",
            name: "Muhammad Adib",
            email: "muhadib@tokokita.com",
            password: hashPassword,
            isActive: true
        }
    });

    console.log(`   ✓ ${adminUser.name} (${adminUser.username})`);
    console.log(`   ✓ Email    : ${adminUser.email}`);
    console.log(`   ✓ Password : Password123!@  ← Segera ganti setelah login!`);
    console.log("✅ Akun Administrator berhasil di-seed\n");

    console.log("🎉 Seeding selesai!");
}

main()
    .catch((e) => {
        console.log("❌ Seeding gagal:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
import cloudinary from "@/app/lib/cloudinery";
import { NextResponse } from "next/server";
import { Client } from "pg";

const clientConfig = {
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "apiCrud",
};

async function connectToDatabase() {
  const client = new Client(clientConfig);
  await client.connect();
  return client;
}

export async function GET(req: Request) {
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const query = "SELECT id, name, email, department, fee, image_url, video_url FROM studentsData;";
    const result = await client.query(query);
    await client.end();
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Database connection error:", err);
    return NextResponse.json(
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const fee = formData.get("fee") as string;
    const image = formData.get("image") as File;
    const video = formData.get("video") as File;

    let imageUrl = "";
    let videoUrl = "";

    if (image) {
      const imageBuffer = await image.arrayBuffer();
      const imageUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(imageBuffer));
      });
      imageUrl = (imageUploadResult as any).secure_url;
    }

    if (video) {
      const videoBuffer = await video.arrayBuffer();
      const videoUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "video" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(videoBuffer));
      });
      videoUrl = (videoUploadResult as any).secure_url;
    }

    const query = `
      INSERT INTO studentsData (name, email, department, fee, image_url, video_url)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [name, email, department, fee, imageUrl, videoUrl];
    const result = await client.query(query, values);

    return NextResponse.json({
      message: "Student added successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

export async function DELETE(req: Request) {
  const client = new Client(clientConfig);

  try {
    await client.connect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const query = "DELETE FROM studentsData WHERE id = $1 RETURNING *";
    const result = await client.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Student deleted successfully",
      deletedStudent: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

export async function PUT(req: Request) {
  const client = await connectToDatabase();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const fee = formData.get("fee") as string;
    const image = formData.get("image") as File | null;
    const video = formData.get("video") as File | null;

    let imageUrl = "";
    let videoUrl = "";

    if (image) {
      const imageBuffer = await image.arrayBuffer();
      const imageUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(imageBuffer));
      });
      imageUrl = (imageUploadResult as any).secure_url;
    }

    if (video) {
      const videoBuffer = await video.arrayBuffer();
      const videoUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "video" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(Buffer.from(videoBuffer));
      });
      videoUrl = (videoUploadResult as any).secure_url;
    }

    const query = `
        UPDATE studentsData 
        SET name = $1, email = $2, department = $3, fee = $4, 
            image_url = COALESCE($5, image_url), 
            video_url = COALESCE($6, video_url)
        WHERE id = $7
        RETURNING *;
      `;
    const values = [
      name,
      email,
      department,
      fee,
      imageUrl || null,
      videoUrl || null,
      id,
    ];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Student updated successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating data in the database:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

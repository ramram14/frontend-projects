import RegisterForm from "@/components/forms/register.form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to Story Hive",
};

const RegisterPage = () => {
  return (
    <main className="w-full h-dvh max-w-5xl mx-auto grid md:place-content-center md:grid-cols-2 gap-10">
      {/* Only visible on large screens */}
      <section className="hidden md:grid h-full place-content-center">
        <div>
          <h1 className="text-4xl font-bold py-4">Story Hive</h1>
          <p className="text-pretty text-xl leading-relaxed">
            Welcome to Story Hive, a dynamic platform where writers,
            storytellers, and thinkers from all walks of life come together to
            share their words with the world. Whether you&apos;re a seasoned
            author, an aspiring poet, or someone with a story to tell, Story
            Hive provides a space for you to publish, explore, and connect.
          </p>
        </div>
      </section>

      <section className="grid h-full place-content-center">
        <p className="text-pretty text-xl font-semibold leading-relaxed p-4">
          Ready to embark on this literary journey? Sign up now and start
          sharing your stories with the world.
        </p>
        <RegisterForm />
        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;

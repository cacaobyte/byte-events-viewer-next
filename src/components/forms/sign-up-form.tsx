"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useUserStore } from "@/lib/store"
import { useI18n } from "@/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const addUser = useUserStore((state) => state.addUser)
  const i18n = useI18n()

  const formSchema = z.object({
    username: z
      .string()
      .min(1, { message: i18n.t("sign-up.username-required") }),
    email: z.string().email({ message: i18n.t("sign-up.email-invalid") }),
    password: z
      .string()
      .min(6, { message: i18n.t("sign-up.password-min-length") }),
    phone_number: z
      .string()
      .min(10, { message: i18n.t("sign-up.phone-number-invalid") }),
    address: z.string().min(1, { message: i18n.t("sign-up.address-required") }),
  })

  type RegisterFormValue = z.infer<typeof formSchema>

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
    },
  })

  const onSubmit = async (data: RegisterFormValue) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call
      addUser(data.username, "token")
      router.push("/")
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-[450px] space-y-4 p-4">
      <CardHeader className="space-y-2 text-center">
        <Icons.logo className="mx-auto size-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {i18n.t("sign-up.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {i18n.t("sign-up.description")}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.t("sign-up.username-label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={i18n.t("sign-up.username-placeholder")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.t("sign-up.email-label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={i18n.t("sign-up.email-placeholder")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.t("sign-up.password-label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={i18n.t("sign-up.password-placeholder")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.t("sign-up.phone-number-label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={i18n.t("sign-up.phone-number-placeholder")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18n.t("sign-up.address-label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={i18n.t("sign-up.address-placeholder")}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} className="w-full" type="submit">
              {loading
                ? i18n.t("sign-up.submitting")
                : i18n.t("sign-up.submit-button")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          {i18n.t("sign-up.already-have-account")}{" "}
          <Link
            href="/sign-in"
            className="hover:text-primary underline underline-offset-4"
          >
            {i18n.t("sign-up.sign-in")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

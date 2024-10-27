"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const [loading, setLoading] = useState(false)
  const addUser = useUserStore((state) => state.addUser)
  const defaultValues = {
    identifier: "",
    password: "",
  }
  const i18n = useI18n()

  const formSchema = z.object({
    identifier: z
      .string()
      .min(1, { message: i18n.t("sign-in.identifierRequired") })
      .refine((val) => val.includes("@") || /^[a-zA-Z0-9_]+$/.test(val), {
        message: i18n.t("sign-in.identifierInvalid"),
      }),
    password: z
      .string()
      .min(6, { message: i18n.t("sign-in.passwordMinLength") }),
  })

  type UserFormValue = z.infer<typeof formSchema>

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    router.push("/")
    addUser("Mario Arita", "token")
  }

  return (
    <>
      <Card className="space-y-4 p-4 sm:w-[450px]">
        <CardHeader className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {i18n.t("sign-in.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {i18n.t("sign-in.description")}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{i18n.t("sign-in.identifierLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={i18n.t("sign-in.identifierPlaceholder")}
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
                    <FormLabel>{i18n.t("sign-in.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={i18n.t("sign-in.passwordPlaceholder")}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="ml-auto w-full"
                type="submit"
              >
                {i18n.t("sign-in.submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground w-full text-center text-sm">
            {i18n.t("sign-in.dont-have-account")}&nbsp;
            <Link
              href="/sign-up"
              className="hover:text-brand underline underline-offset-4"
            >
              {i18n.t("sign-in.sign-up")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  )
}

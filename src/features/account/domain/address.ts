import { z } from "zod";

export const AddressSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  label: z.string().min(1).max(40).default("Casa"),
  name: z.string().min(1).max(80),
  line1: z.string().min(1).max(200),
  line2: z.string().max(120).optional().default(""),
  city: z.string().min(1).max(80),
  department: z.string().min(1).max(80),
  postalCode: z.string().max(20).optional().default(""),
  phone: z.string().min(7).max(20),
  isDefault: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Address = z.infer<typeof AddressSchema>;

export const NewAddressInputSchema = AddressSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  label: true,
  line2: true,
  postalCode: true,
  isDefault: true,
});

export type NewAddressInput = z.infer<typeof NewAddressInputSchema>;

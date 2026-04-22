# How to Add Declared Value (item_value) Column to Supabase

## Step 1: Run the SQL Script

1. Go to your Supabase SQL Editor:
   **https://supabase.com/dashboard/project/fmppyrxizbbtxmhvdqeg/sql**

2. Copy the entire content from `add_item_value_column.sql`

3. Paste it into the SQL Editor

4. Click **RUN**

## Step 2: Update Your Code

After running the SQL, you need to update your code:

### 1. Update the `FrontendPackage` interface (in `packages/page.tsx`):
```typescript
interface FrontendPackage {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  weight: number;
  dimensions: string;
  itemValue: number;  // Add this line
  status: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

### 2. Update the create form state:
```typescript
const [createForm, setCreateForm] = useState({
  trackingNumber: '',
  senderName: '',
  senderAddress: '',
  recipientName: '',
  recipientAddress: '',
  weight: 1.0,
  dimensions: '30x20x15 cm',
  itemValue: 0,  // Add this line
  status: 'pending',
  estimatedDelivery: new Date().toISOString().split('T')[0]
});
```

### 3. Add the Declared Value field to the create modal:
Add this input field in the grid (change grid from `md:grid-cols-3` to `md:grid-cols-4`):
```jsx
<div>
  <label className="block text-sm font-medium text-gray-400 mb-2">Declared Value ($)</label>
  <input
    type="number"
    step="0.01"
    min="0"
    placeholder="0.00"
    value={createForm.itemValue}
    onChange={(e) => setCreateForm({ ...createForm, itemValue: parseFloat(e.target.value) || 0 })}
    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
  />
</div>
```

### 4. Update the Supabase insert:
```typescript
const { data, error } = await supabase
  .from('packages')
  .insert([{
    tracking_number: newPackage.trackingNumber,
    sender_name: newPackage.senderName,
    sender_address: newPackage.senderAddress,
    receiver_name: newPackage.recipientName,
    receiver_address: newPackage.recipientAddress,
    weight_kg: newPackage.weight,
    dimensions: newPackage.dimensions,
    item_value: newPackage.itemValue || 0,  // Add this line
    status: newPackage.status,
    estimated_delivery: newPackage.estimatedDelivery,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }])
  .select();
```

## Step 3: Test

1. Restart your development server if needed
2. Go to `/only-admin/packages`
3. Click "Add Package"
4. You should see the "Declared Value ($)" field
5. Enter a value and create the package
6. Check the tracking page to see if the value appears

## Troubleshooting

If you get errors after adding the column:

1. **Column already exists**: The SQL will fail if `item_value` already exists
2. **Type mismatch**: Make sure you're using `DECIMAL(10,2)` in SQL and `number` in TypeScript
3. **Null values**: Existing packages will have `item_value = 0` (or NULL if you used the nullable option)

## What This Adds

- **Declared Value field** in package creation form
- **Database column** to store the value
- **Tracking page display** in PackageDetails component
- **Better package information** for tracking and management
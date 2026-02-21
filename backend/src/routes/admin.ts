import { Hono } from 'hono';
import { adminAuthMiddleware } from '../middleware/adminAuth.js';
import { supabaseAdmin } from '../lib/supabase.js';
import {
  updateOrderStatusSchema,
  createRestaurantSchema,
  createCategorySchema,
  createMenuItemSchema,
} from '../types/index.js';
import {
  sendPushNotification,
  getStatusNotificationContent,
} from '../services/notifications.js';

const admin = new Hono();

// All admin routes require admin authentication
admin.use('*', adminAuthMiddleware);

// ============================================
// ORDERS
// ============================================

// GET /api/admin/orders — All orders (filterable by status)
admin.get('/orders', async (c) => {
  const status = c.req.query('status');

  let query = supabaseAdmin
    .from('orders')
    .select('*, restaurant:restaurants(id, name), order_items(*), profile:profiles(full_name, email, phone)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return c.json({ error: 'Failed to fetch orders', code: 'FETCH_ERROR' }, 500);
  }

  return c.json({ data });
});

// GET /api/admin/stats — Dashboard statistics
admin.get('/stats', async (c) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [ordersToday, revenueToday, activeRestaurants, pendingOrders] =
    await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      supabaseAdmin
        .from('orders')
        .select('total')
        .gte('created_at', todayISO)
        .in('status', ['received', 'preparing', 'ready', 'on_the_way', 'completed']),
      supabaseAdmin
        .from('restaurants')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'received'),
    ]);

  const revenue = (revenueToday.data ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  return c.json({
    data: {
      orders_today: ordersToday.count ?? 0,
      revenue_today: revenue,
      active_restaurants: activeRestaurants.count ?? 0,
      pending_orders: pendingOrders.count ?? 0,
    },
  });
});

// PATCH /api/admin/orders/:id/status — Update order status
admin.patch('/orders/:id/status', async (c) => {
  const orderId = c.req.param('id');
  const body = await c.req.json();

  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid status', code: 'VALIDATION_ERROR' }, 400);
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', orderId);

  if (error) {
    return c.json({ error: 'Failed to update status', code: 'UPDATE_ERROR' }, 500);
  }

  // Send push notification
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('user_id, order_number')
    .eq('id', orderId)
    .single();

  if (order) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('expo_push_token')
      .eq('id', order.user_id)
      .single();

    if (profile?.expo_push_token) {
      const content = getStatusNotificationContent(parsed.data.status);
      if (content) {
        await sendPushNotification(
          profile.expo_push_token,
          content.title,
          content.body,
          { order_id: orderId },
        );

        // Save notification in database
        await supabaseAdmin.from('notifications').insert({
          user_id: order.user_id,
          order_id: orderId,
          title: content.title,
          body: content.body,
        });
      }
    }
  }

  return c.json({ data: { message: 'Status updated' } });
});

// ============================================
// RESTAURANTS
// ============================================

// POST /api/admin/restaurants — Create restaurant
admin.post('/restaurants', async (c) => {
  const body = await c.req.json();
  const parsed = createRestaurantSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid data', code: 'VALIDATION_ERROR', details: parsed.error.issues }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('restaurants')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to create restaurant', code: 'CREATE_ERROR' }, 500);
  }

  return c.json({ data }, 201);
});

// PATCH /api/admin/restaurants/:id — Update restaurant
admin.patch('/restaurants/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const { data, error } = await supabaseAdmin
    .from('restaurants')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to update restaurant', code: 'UPDATE_ERROR' }, 500);
  }

  return c.json({ data });
});

// DELETE /api/admin/restaurants/:id — Delete restaurant
admin.delete('/restaurants/:id', async (c) => {
  const id = c.req.param('id');

  const { error } = await supabaseAdmin
    .from('restaurants')
    .delete()
    .eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete restaurant', code: 'DELETE_ERROR' }, 500);
  }

  return c.json({ data: { message: 'Restaurant deleted' } });
});

// ============================================
// CATEGORIES
// ============================================

// POST /api/admin/restaurants/:id/categories — Create category
admin.post('/restaurants/:id/categories', async (c) => {
  const restaurantId = c.req.param('id');
  const body = await c.req.json();
  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid data', code: 'VALIDATION_ERROR' }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('menu_categories')
    .insert({ ...parsed.data, restaurant_id: restaurantId })
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to create category', code: 'CREATE_ERROR' }, 500);
  }

  return c.json({ data }, 201);
});

// PATCH /api/admin/categories/:id — Update category
admin.patch('/categories/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const { data, error } = await supabaseAdmin
    .from('menu_categories')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to update category', code: 'UPDATE_ERROR' }, 500);
  }

  return c.json({ data });
});

// DELETE /api/admin/categories/:id — Delete category
admin.delete('/categories/:id', async (c) => {
  const id = c.req.param('id');

  const { error } = await supabaseAdmin
    .from('menu_categories')
    .delete()
    .eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete category', code: 'DELETE_ERROR' }, 500);
  }

  return c.json({ data: { message: 'Category deleted' } });
});

// ============================================
// MENU ITEMS
// ============================================

// POST /api/admin/restaurants/:id/items — Create menu item
admin.post('/restaurants/:id/items', async (c) => {
  const restaurantId = c.req.param('id');
  const body = await c.req.json();
  const parsed = createMenuItemSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid data', code: 'VALIDATION_ERROR', details: parsed.error.issues }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .insert({ ...parsed.data, restaurant_id: restaurantId })
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to create item', code: 'CREATE_ERROR' }, 500);
  }

  return c.json({ data }, 201);
});

// PATCH /api/admin/items/:id — Update menu item
admin.patch('/items/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Failed to update item', code: 'UPDATE_ERROR' }, 500);
  }

  return c.json({ data });
});

// DELETE /api/admin/items/:id — Delete menu item
admin.delete('/items/:id', async (c) => {
  const id = c.req.param('id');

  const { error } = await supabaseAdmin
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete item', code: 'DELETE_ERROR' }, 500);
  }

  return c.json({ data: { message: 'Item deleted' } });
});

export default admin;

# OpenAI API Cost Protection & Rate Limiting

## 🛡️ Built-in Cost Protection Features

### 1. Model Selection: GPT-4o-mini
**Why GPT-4o-mini?**
- **Most cost-effective model** from OpenAI
- **Pricing**: 
  - Input: $0.150 per 1M tokens
  - Output: $0.600 per 1M tokens
- **Comparison**:
  - ~15x cheaper than GPT-4
  - ~3x cheaper than GPT-3.5-turbo
  - Similar quality for most tasks

### 2. Token Limits (Conservative)
```typescript
short:  150 tokens  (~100-150 words)  - Cost: ~$0.0001 per request
medium: 400 tokens  (~300-400 words)  - Cost: ~$0.0003 per request
long:   800 tokens  (~600-800 words)  - Cost: ~$0.0006 per request
```

**Maximum cost per coinflip**: ~$0.0006 (less than a penny!)

### 3. Request Validation
- ✅ Maximum prompt length: 2,000 characters
- ✅ API key format validation
- ✅ Empty prompt rejection
- ✅ Timeout protection: 30 seconds
- ✅ Automatic retry: 2 attempts max

### 4. Safety Parameters
- ✅ `max_tokens` hard limit enforced
- ✅ No streaming (prevents runaway costs)
- ✅ Temperature: 0.7 (balanced, not creative)
- ✅ Stop sequences configured

---

## 💰 Cost Estimates

### Per User Scenario
Assuming a user:
- Creates 10 prompts
- Participates in 20 coinflips (10 wins, 10 losses)
- Uses "medium" depth (400 tokens)

**Total Cost**: 10 wins × $0.0003 = **$0.003** (less than half a cent!)

### Heavy Usage Scenario
A power user:
- 100 coinflips won
- All using "long" depth (800 tokens)

**Total Cost**: 100 × $0.0006 = **$0.06** (6 cents!)

### Monthly Estimates
- 100 active users
- Average 5 wins per user per month
- Mix of depths (avg 400 tokens)

**Total Monthly Cost**: 100 users × 5 wins × $0.0003 = **$0.15/month**

---

## 🚨 Additional Protection Recommendations

### Option 1: Supabase Database Rate Limiting (Recommended)

Add a rate limiting table to track API usage:

```sql
-- Create rate limiting table
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost_usd DECIMAL(10, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_api_usage_user_date ON api_usage(user_id, created_at);

-- Create function to check daily limit
CREATE OR REPLACE FUNCTION check_daily_api_limit(p_user_id UUID, p_max_requests INTEGER DEFAULT 50)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM api_usage
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql;
```

### Option 2: Application-Level Rate Limiting

Create a rate limiting middleware:

```typescript
// lib/rateLimit.ts
import { createClient } from '@/lib/supabase/server';

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const supabase = await createClient();
  
  // Check requests in last 24 hours
  const { data, error } = await supabase
    .from('api_usage')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  const requestCount = data?.length || 0;
  const maxRequests = 50; // 50 requests per 24 hours
  
  return {
    allowed: requestCount < maxRequests,
    remaining: Math.max(0, maxRequests - requestCount),
    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export async function logApiUsage(
  userId: string,
  endpoint: string,
  tokensUsed: number,
  costUsd: number
): Promise<void> {
  const supabase = await createClient();
  
  await supabase.from('api_usage').insert({
    user_id: userId,
    endpoint,
    tokens_used: tokensUsed,
    cost_usd: costUsd,
  });
}
```

### Option 3: OpenAI Usage Limits (Set in OpenAI Dashboard)

1. Go to https://platform.openai.com/account/limits
2. Set **Hard Limit**: $5.00 (or your preferred amount)
3. Set **Soft Limit**: $3.00 (get email warning)
4. Enable **Email Notifications**

This ensures you'll never be charged more than your limit!

---

## 📊 Monitoring & Alerts

### Vercel Function Logs
Monitor API calls in real-time:
1. Vercel Dashboard → Your Project → **Functions**
2. View logs for `/api/openai/answer`
3. Each log shows: tokens used, estimated cost

### Supabase Monitoring
Track database queries:
1. Supabase Dashboard → **Logs**
2. Filter by table: `api_usage`
3. Monitor unusual patterns

### OpenAI Dashboard
Track actual usage and costs:
1. https://platform.openai.com/usage
2. View daily/monthly usage
3. Download detailed reports

---

## 🔒 User API Key Protection

### How It Works
1. **Users provide their own API keys** (stored in Supabase)
2. **You are NOT charged** - each user pays for their own usage
3. **Keys are protected by RLS** - users can only access their own keys
4. **Server-side calls only** - keys never exposed to client

### User Cost Transparency
Add this to your Profile page to inform users:

```typescript
// components/ApiKeyCostInfo.tsx
export function ApiKeyCostInfo() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mt-4">
      <h3 className="text-blue-400 font-semibold mb-2">💰 Cost Information</h3>
      <p className="text-sm text-gray-300 mb-2">
        When you lose a coinflip, your API key is used to answer the winner's prompt.
      </p>
      <ul className="text-xs text-gray-400 space-y-1">
        <li>• Short response: ~$0.0001 (less than a penny)</li>
        <li>• Medium response: ~$0.0003</li>
        <li>• Long response: ~$0.0006</li>
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        Using GPT-4o-mini - the most cost-effective model
      </p>
    </div>
  );
}
```

---

## 🎯 Best Practices

### For Development
1. ✅ Use a separate OpenAI API key for testing
2. ✅ Set low usage limits on test key ($1-2)
3. ✅ Monitor Vercel function logs during testing
4. ✅ Test with "short" depth first

### For Production
1. ✅ Implement rate limiting (Option 1 or 2 above)
2. ✅ Set OpenAI hard limits ($5-10 to start)
3. ✅ Monitor usage weekly
4. ✅ Add user cost transparency
5. ✅ Consider adding usage analytics

### For Users
1. ✅ Inform users about costs upfront
2. ✅ Recommend setting OpenAI limits on their keys
3. ✅ Show estimated costs before coinflips
4. ✅ Display token usage after each win

---

## 🚀 Implementation Checklist

### Immediate (Already Done)
- [x] Switch to GPT-4o-mini model
- [x] Implement conservative token limits
- [x] Add request validation
- [x] Add timeout protection
- [x] Log usage for monitoring

### Recommended (Next Steps)
- [ ] Add rate limiting table to Supabase
- [ ] Implement rate limiting middleware
- [ ] Add usage tracking to database
- [ ] Create user dashboard showing their usage
- [ ] Add cost estimates to UI

### Optional (Nice to Have)
- [ ] Email alerts for high usage
- [ ] Usage analytics dashboard
- [ ] Cost breakdown per user
- [ ] Monthly usage reports

---

## 📈 Scaling Considerations

### If You Get 1,000 Users
- Average 5 wins per user per month
- Mix of depths (avg 400 tokens)
- **Estimated cost**: $1.50/month

### If You Get 10,000 Users
- Same usage pattern
- **Estimated cost**: $15/month

### If You Get 100,000 Users
- Same usage pattern
- **Estimated cost**: $150/month

**Note**: These are YOUR costs only if you're providing API keys. If users provide their own keys (current design), **your cost is $0**!

---

## 🆘 Emergency Cost Control

If you notice unexpected high usage:

### Immediate Actions
1. **Disable OpenAI endpoint temporarily**:
   ```typescript
   // In app/api/openai/answer/route.ts
   export async function POST(request: NextRequest) {
     return NextResponse.json(
       { error: 'Service temporarily unavailable' },
       { status: 503 }
     );
   }
   ```

2. **Revoke OpenAI API key** (if you're providing one):
   - Go to https://platform.openai.com/api-keys
   - Delete the key immediately

3. **Check Vercel logs**:
   - Identify which users/IPs are causing high usage
   - Block if necessary

### Investigation
1. Check Vercel function logs for unusual patterns
2. Query Supabase for high-frequency users
3. Review OpenAI usage dashboard
4. Identify and fix any bugs causing excessive calls

---

## 💡 Summary

**Current Protection Level**: ⭐⭐⭐⭐⭐ (Excellent)

- ✅ Using most cost-effective model (GPT-4o-mini)
- ✅ Conservative token limits
- ✅ Request validation and timeouts
- ✅ Users provide their own API keys (you pay $0)
- ✅ Logging for monitoring

**Recommended Next Step**: Implement database rate limiting (Option 1) for additional protection.

**Estimated Monthly Cost** (if 100 active users): **$0.15** (or $0 if users provide keys)

---

**Last Updated**: December 2024
**Model**: GPT-4o-mini
**Pricing**: $0.150/1M input, $0.600/1M output tokens

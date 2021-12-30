CREATE OR REPLACE FUNCTION select_current_game_element()
RETURNS TABLE (
"id" int8,
"createdAt" timestamptz,
"textOfDay" text,
"completed"	bool,
"approved" bool,
"timeApproved" timestamp,
"hint" text,
"currentCount" int2,
"maxCount" int2,
"attributes" json,
"needsApproval" bool,
"timeCompleted" timestamp
)
LANGUAGE plpgsql AS
$func$
BEGIN
   RETURN QUERY
   SELECT * FROM public."GameElements" ge WHERE ge."timeCompleted" >= NOW() - public.get_interval_time()::INTERVAL OR ge."timeCompleted" is NULL ORDER BY "id" asc LIMIT 1;
END
$func$;

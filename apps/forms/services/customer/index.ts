import { workspaceclient } from "@/lib/supabase/server";
import { is_uuid_v4 } from "@/utils/is";

export async function upsert_customer_with({
  project_id,
  uuid,
  hints,
}: {
  project_id: number;
  uuid?: string | null;
  hints?: {
    email?: string;
    _fp_fingerprintjs_visitorid?: string;
  };
}) {
  const pl: {
    uuid?: string | null;
    project_id: number;
    email?: string;
    _fp_fingerprintjs_visitorid?: string;
    last_seen_at: string;
  } = {
    uuid: uuid,
    project_id: project_id,
    email: hints?.email,
    _fp_fingerprintjs_visitorid: hints?._fp_fingerprintjs_visitorid,
    last_seen_at: new Date().toISOString(),
  };

  // console.log("customer::payload:", pl);
  if (uuid && is_uuid_v4(uuid)) {
    const { data: customer, error } = await workspaceclient
      .from("customer")
      .upsert(pl, {
        onConflict: "project_id, uuid",
      })
      .select()
      .single();

    if (error) {
      console.error("customer::error#1:", error, pl);
      if (error.code === "23505") {
        // this means there is a existing customer with (porbably) fingerprintjs_visitorid.
        // in this case, it needs to be merged (if possible - if the existing one does not have uuid set)
        // this can happen when,
        // 1. developer ran the form without hidden field (_gf_customer_uuid)
        // 2. developer ran the form with hidden field (_gf_customer_uuid) but the customer is already created with fingerprintjs_visitorid
        const { data: customer, error } = await workspaceclient
          .from("customer")
          .upsert(pl, {
            onConflict: "project_id, _fp_fingerprintjs_visitorid",
          })
          .select()
          .single();
        if (error) {
          console.error("customer::error#2:", error, pl);
          if (error.code === "23505") {
            // even after trying to merge, if it fails, then do not merge and upsert customer using only uuid
            delete pl._fp_fingerprintjs_visitorid;
            const { data: customer, error } = await workspaceclient
              .from("customer")
              .upsert(pl, {
                onConflict: "project_id, uuid",
              })
              .select()
              .single();
            if (error) {
              console.error("customer::error#3:", error, pl);
              throw error;
            }

            console.log(
              "c: above error is resolved by merging without _fp_fingerprintjs_visitorid"
            );
            return customer;
          }
        }
        console.log(
          "c: above error is resolved by merging with _fp_fingerprintjs_visitorid"
        );
        return customer;
      }
    }
    // console.log("customer::upserted:", customer);
    return customer;
  } else {
    const { data: customer, error } = await workspaceclient
      .from("customer")
      .upsert(pl, {
        onConflict: "project_id, _fp_fingerprintjs_visitorid",
      })
      .select()
      .single();

    error && console.error("customer::error-1:", error);
    // console.log("customer::upserted:", customer);
    return customer;
  }
}

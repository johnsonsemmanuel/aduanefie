import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Property 4: Community Zone assignment constraint
 * Any task assignment logic must satisfy:
 *   task.community_zone_id === agent.community_zone_id OR agent.out_of_zone_accepted === true
 */

function canAgentAcceptTask(agent, task) {
  if (agent.out_of_zone_accepted === true) return true;
  return task.community_zone_id === agent.community_zone_id;
}

describe("Property 4: Community Zone assignment constraint", () => {
  test("agent can accept task in same community zone", () => {
    const agent = { community_zone_id: "zone-1", out_of_zone_accepted: false };
    const task = { community_zone_id: "zone-1" };
    assert.strictEqual(canAgentAcceptTask(agent, task), true);
  });

  test("agent cannot accept task in different community zone when out_of_zone_accepted is false", () => {
    const agent = { community_zone_id: "zone-1", out_of_zone_accepted: false };
    const task = { community_zone_id: "zone-2" };
    assert.strictEqual(canAgentAcceptTask(agent, task), false);
  });

  test("agent can accept task in different community zone when out_of_zone_accepted is true", () => {
    const agent = { community_zone_id: "zone-1", out_of_zone_accepted: true };
    const task = { community_zone_id: "zone-2" };
    assert.strictEqual(canAgentAcceptTask(agent, task), true);
  });

  test("agent can accept task when both zone ids are null and out_of_zone_accepted is false", () => {
    const agent = { community_zone_id: null, out_of_zone_accepted: false };
    const task = { community_zone_id: null };
    assert.strictEqual(canAgentAcceptTask(agent, task), true);
  });

  test("agent cannot accept task when zones differ and out_of_zone_accepted is false", () => {
    const agent = { community_zone_id: "zone-a", out_of_zone_accepted: false };
    const task = { community_zone_id: "zone-b" };
    assert.strictEqual(canAgentAcceptTask(agent, task), false);
  });

  test("randomized property test over 100 samples", () => {
    for (let i = 0; i < 100; i++) {
      const agentZone = `zone-${Math.floor(Math.random() * 10)}`;
      const taskZone = `zone-${Math.floor(Math.random() * 10)}`;
      const outOfZoneAccepted = Math.random() > 0.5;
      const agent = { community_zone_id: agentZone, out_of_zone_accepted: outOfZoneAccepted };
      const task = { community_zone_id: taskZone };

      const result = canAgentAcceptTask(agent, task);
      if (!outOfZoneAccepted && agentZone !== taskZone) {
        assert.strictEqual(result, false);
      } else {
        assert.strictEqual(result, true);
      }
    }
  });
});
